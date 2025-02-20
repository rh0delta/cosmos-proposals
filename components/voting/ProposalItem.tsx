import { Box, Divider, Stack, Text } from "@interchain-ui/react";
import Show from "../common/Show";


export default function ProposalItem(props: any) {
  return (
    <Box
      className={props.className}
      {...props.attributes}
      borderRadius="$lg"
      borderColor="$inputBorder"
      borderStyle="$solid"
      borderWidth="$sm"
      minHeight={{
        tablet: "104px",
      }}
      px={{
        mobile: "$9",
        tablet: "$12",
      }}
      py={{
        mobile: "$6",
        tablet: "$10",
      }}
      attributes={{
        "data-part-id": "root",
      }}
    >
      <Box
        display="flex"
        flexDirection={{
          mobile: "column",
          tablet: "row",
          desktop: "row",
        }}
        justifyContent="flex-start"
        alignItems={{
          mobile: "flex-start",
          tablet: "center",
          desktop: "center",
        }}
        gap="$10"
        height="100%"
        minWidth="$0"
        attributes={{
          "data-part-id": "content",
        }}
      >
        {/* Desktop Checkbox */}
        <Box
          display={{
            mobile: "none",
            tablet: "block",
            desktop: "block",
          }}
          flexShrink="0"
          width="84px"
          attributes={{
            "data-part-id": "checkboxes",
          }}
        >
          <Show when={props.status === "pending"}>
            <Text
              as={typeof props.title === "string" ? "p" : "div"}
              color="$text"
              fontSize="$sm"
              fontWeight="$normal"
              textTransform="capitalize"
              attributes={{
                whiteSpace: "pre-wrap"
              }}
            >
              {props.status}
            </Text>
          </Show>

          <Show when={props.status === "passed"}>
            <Text
              as={typeof props.title === "string" ? "p" : "div"}
              color="$text"
              fontSize="$sm"
              fontWeight="$normal"
              textTransform="capitalize"
              attributes={{
                whiteSpace: "pre-wrap"
              }}
            >
              {props.status}
            </Text>
          </Show>

          <Show when={props.status === "rejected"}>
            <Text
              as={typeof props.title === "string" ? "p" : "div"}
              color="$text"
              fontSize="$sm"
              fontWeight="$normal"
              textTransform="capitalize"
              attributes={{
                whiteSpace: "pre-wrap"
              }}
            >
              {props.status}
            </Text>
          </Show>
        </Box>

        {/* Mid info section */}
        <Stack
          direction="horizontal"
          space="$10"
          attributes={{
            width: {
              mobile: "100%",
              tablet: "auto",
              desktop: "auto",
            },
            flex: 1,
            overflow: "hidden",
            justifyContent: "flex-start",
            alignItems: {
              mobile: "flex-start",
              tablet: "center",
              desktop: "center",
            },
          }}
          domAttributes={{
            "data-part-id": "mid",
          }}
        >
          <Stack
            direction="vertical"
            space="$2"
            attributes={{
              display: {
                mobile: "flex",
                tablet: "none",
                desktop: "none",
              },
            }}
          >
            {/* Mobile Checkbox */}
            <Box flexShrink="0" width="84px">
              <Show when={props.status === "pending"}>
                <Text
                  as={typeof props.title === "string" ? "p" : "div"}
                  color="$text"
                  fontSize="$sm"
                  fontWeight="$normal"
                  textTransform="capitalize"
                  attributes={{
                    whiteSpace: "pre-wrap"
                  }}
                >
                  {props.status}
                </Text>
              </Show>

              <Show when={props.status === "passed"}>
                <Text
                  as={typeof props.title === "string" ? "p" : "div"}
                  color="$text"
                  fontSize="$sm"
                  fontWeight="$normal"
                  textTransform="capitalize"
                  attributes={{
                    whiteSpace: "pre-wrap"
                  }}
                >
                  {props.status}
                </Text>
              </Show>

              <Show when={props.status === "rejected"}>
                <Text
                  as={typeof props.title === "string" ? "p" : "div"}
                  color="$text"
                  fontSize="$sm"
                  fontWeight="$normal"
                  textTransform="capitalize"
                  attributes={{
                    whiteSpace: "pre-wrap"
                  }}
                >
                  {props.status}
                </Text>
              </Show>
            </Box>

            {/* Mobile voting end time */}
            <Stack
              direction="vertical"
              space="$1"
              attributes={{
                flexGrow: "0",
              }}
            >
              <Text color="$textSecondary" fontSize="$2xs" fontWeight="$normal">
                {props.endTime}
              </Text>
            </Stack>
          </Stack>

          {/* Vertical Divider */}
          <Box
            display={{
              mobile: "none",
              tablet: "flex",
              desktop: "flex",
            }}
            alignItems="center"
            justifyContent="center"
            height="44px"
          >
            <Divider orientation="vertical" />
          </Box>

          {/* Titles */}
          <Stack
            direction="vertical"
            space="$4"
            attributes={{
              width: "100%",
            }}
          >
            <Text
              as={typeof props.title === "string" ? "p" : "div"}
              color="$text"
              fontSize="$sm"
              fontWeight="$normal"
              attributes={{
                whiteSpace: "pre-wrap",
              }}
            >
              {props.title}
            </Text>

            <Show when={props.id}>
              <Text color="$textSecondary" fontSize="$xs" fontWeight="$normal">
                {props.id}
              </Text>
            </Show>
          </Stack>
        </Stack>

        {/* Desktop voting end time */}
        <Stack
          direction="vertical"
          space="$1"
          attributes={{
            display: {
              mobile: "none",
              tablet: "flex",
              desktop: "flex",
            },
            flexGrow: "0",
          }}
        >
          <Text color="$textSecondary" fontSize="$sm" fontWeight="$semibold">
            {props.endTimeLabel}
          </Text>
          <Text color="$textSecondary" fontSize="$xs" fontWeight="$normal">
            {props.endTime}
          </Text>
        </Stack>
      </Box>
    </Box>
  )
}