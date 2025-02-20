export default function Show (props: { when: boolean | (() => boolean); children: any; }) {
  return (
    props.when ? props.children : null
  )
}