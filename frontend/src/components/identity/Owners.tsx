import Owner from "./Owner"

const Owners = ({ owners, identityConfig }) => {
    return (<div>
        <h2 className="subheading ">Owners</h2>
        <div className="w-full flex rounded-lg overflow-hidden shadow-[9px_9px_45px_-17px_rgba(0,0,0,0.75)]">
            {owners?.map((address, idx) => {
                return <Owner address={address} key={idx} idx={idx} identityConfig={identityConfig} />
            })}
        </div>
    </div>)
}

export default Owners