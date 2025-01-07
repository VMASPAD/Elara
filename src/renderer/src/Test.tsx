/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */

function Test() {
  return (
    <div>
      <webview
        partition="persist:my-partition"
        src={'https://motion.dev/docs/react-animation'}
        className="h-52 w-52 m-2 rounded-xl overflow-hidden"
      />

      <webview
        partition="persist:my-partition"
        src={'https://motion.dev/docs/react-animation'}
        className="h-52 w-52 m-2 rounded-xl overflow-hidden"
      />
    </div>
  )
}

export default Test
