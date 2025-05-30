// style
import Style from './Leaderboard.module.css';

const LeaderboardMember = ({username, score, position, zeroOrOne}) => {
    return ( 
        <div className={zeroOrOne ? Style.LeaderboardMemberContainerZero : Style.LeaderboardMemberContainerOne}>
            <div className={Style.LeaderboardMemberUser}>
                <div className={Style.LeaderboardMember}>{position}.</div>
                <div className={Style.LeaderboardMember}>{username}</div>
            </div>
            <div className={Style.LeaderboardMember}>{score}</div>
        </div>
     );
}
 
export default LeaderboardMember;