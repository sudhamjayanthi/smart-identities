import PickToken from "@components/identity/PickToken"

const Test = () => (
    <div className="w-1/4 m-auto">
        <PickToken  callback={(token) => {console.log("got token : ", token)}}/>
    </div>
)

export default Test