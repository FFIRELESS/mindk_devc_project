export function UserProfile({ user }) {
    return (
        <>
            {
                user.map(({User_ID, University_ID, Username, Fullname, Image, Email, Phone}) =>
                    (<div key={User_ID}>
                        <b> User #{User_ID} from university #{University_ID} </b>
                        <div> {Username} </div>
                        <div> {Fullname} </div>
                        <div> {Image} </div>
                        <div> {Email} </div>
                        <div> {Phone} </div> <br/>
                    </div>))
            }
        </>
    );
}