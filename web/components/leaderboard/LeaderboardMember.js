// style
import Style from './Leaderboard.module.css';

const LeaderboardMember = ({username, score, position}) => {
    return ( 
        <div className={Style.LeaderboardMemberContainer}>
            <div className={Style.LeaderboardMemberUser}>
                <div className={Style.LeaderboardMember}>{position}.</div>
                <div className={Style.LeaderboardMember}>{username}</div>
            </div>
            <div className={Style.LeaderboardMember}>{score}</div>
        </div>
     );
}
 
export default LeaderboardMember;