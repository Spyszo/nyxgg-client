import { useParams } from "react-router"
import axios from "axios"
import { useEffect, useState } from "react"
import "./Player.scss"
import Matches from "./Matches"
//var gg = new (require('../../node_modules/op.gg-api/client.js'))

import TimeAgo from "javascript-time-ago"

import pl from 'javascript-time-ago/locale/pl'

TimeAgo.addDefaultLocale(pl)

const timeAgo = new TimeAgo("en-Us")


const Player = (props) => {

    const { summoner } = useParams()

    const [playerData, setPlayerData] = useState(null)
    const [playerDataLoadError, setPlayerDataLoadError] = useState(false)
    const [updateInProgress, setUpdateInProgress] = useState(false)
    const [followed, setFollowed] = useState(false)


    const rankColors = {
        "iron": "#594a3b",
        "bronze": "#522e0a",
        "silver": "#85847a",
        "gold": "#b58b0e",
        "platinum": "#2fa398",
        "diamond": "#6b6bd1",
        "master": "#9317a6",
        "grandMaster": "#c72c40",
        "challenger": "#40e9ff"
    }

    const kdaColor = {
        "veryBad": "#fa5555",
        "bad": "#ff9191",
        "normal": "#ededed",
        "good": "#9ff092",
        "veryGood": "#75ffdd",
        "excelent": "#f2d022"
    }

    const getKdaColor = kda => {
        if (kda < 1) return kdaColor["veryBad"]
        if (kda < 1.75) return kdaColor["bad"]
        if (kda < 2.25) return kdaColor["normal"]
        if (kda < 3) return kdaColor["good"]
        if (kda < 4) return kdaColor["veryGood"]
        return kdaColor["excelent"]
    }

    const roundWinRatio = winRatio => {
        if (winRatio % 10 < 4) return Math.ceil(winRatio / 10) * 10
        else return Math.round(winRatio / 10) * 10
    }

    const wrColor = {
        0: "#c92200",
        10: "#e04f31",
        20: "#e07431",
        30: "#e09131",
        40: "#e0a331",
        50: "#e0cc31",
        60: "#cee031",
        70: "#bae031",
        80: "#8be031",
        90: "#5de031",
        100: "#31e07a"
    }

    const handleUpdateSummoner = async () => {
        setUpdateInProgress(true)

        const playerData = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/update/${encodeURI(summoner)}`).then(res => res.data).catch(err=>console.log(err))

        if (!playerData) return

        setPlayerData(playerData)

        setUpdateInProgress(false)
    }

    const handleFollowSummoner = async () => {
        if (localStorage.getItem("followedSummoners")) {
            const followedSummoners = JSON.parse(localStorage.getItem("followedSummoners"))

            let isFollowed = false

            for (let x in followedSummoners) {
                if (followedSummoners[x].name === playerData.displayName) {
                    followedSummoners.splice(x, 1)
                    localStorage.setItem("followedSummoners", JSON.stringify(followedSummoners))
                    isFollowed = true
                    setFollowed(false)
                }
            }

            if (!isFollowed) {  
                setFollowed(true)   
                followedSummoners.push({
                    name: playerData.displayName,
                    iconId: playerData.iconId
                })

                localStorage.setItem("followedSummoners", JSON.stringify(followedSummoners))
            }
        

        } else {
            setFollowed(true)
            localStorage.setItem("followedSummoners", JSON.stringify([{
                name: playerData.displayName,
                iconId: playerData.iconId
            }]))
        }
    }


    useEffect(() => {
        (async () => {
            setPlayerData(null)
            setFollowed(false)

            const playerData = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/stats/${encodeURI(summoner)}`).then(res => res.data).catch(err=>console.log(err))

            if (!playerData) return setPlayerDataLoadError(true)

            setPlayerData(playerData)

            const followedSummoners = JSON.parse(localStorage.getItem("followedSummoners")) || []

            for (let x in followedSummoners) {
                if (followedSummoners[x].name === playerData.displayName) {
                    setFollowed(true)
                }
            }

        })()
    }, [summoner])


    return (
        playerData ?
        <>
            <div className="player-info">
                <div className="avatar">
                    <img src={`https://ddragon.leagueoflegends.com/cdn/${process.env.REACT_APP_LOL_PATCH}/img/profileicon/${playerData.iconId}.png`} alt="avatar" />
                    <div className="level"> {playerData.level} </div>
                </div>
                <div className="info">
                    <div className="old-ranks">
                        {
                            playerData.stats.pastSeasons.map((season) => {
                                //console.log(season)
                                return (
                                    <div style={{ backgroundColor: rankColors[season.tier.toLowerCase()] }} className='rank' key={season.season}>
                                        <span className='season'>S{season.season}</span>{season.tier}
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="name-bar">
                        <p className="name">{playerData.displayName}</p>
                        <div className="buttons">
                            <button className={"update " + (updateInProgress && "loading")} onClick={handleUpdateSummoner}><span className='material-icon'>refresh</span>Odśwież</button>
                            <button onClick={handleFollowSummoner}>{followed? <><span className='material-icon'>done</span>Obserwujesz</>: "Obserwuj"}</button>
                        </div>
                    </div>
                    <div className="ranking">
                        Ranking eune: {playerData.stats.ranking}
                        <span className="last-update">Ostatnia aktualizacja: {playerData.lastUpdate && timeAgo.format(playerData.lastUpdate)}</span>
                    </div>
                </div>
            </div>

            <div className="player-content">
                <div className="side-bar">
                    <div className="ranks">
                        <div className="rank">
                            <p className="queueType">Gra rankingowa Solo/duo</p>
                            {playerData.stats.currentSeason.soloDuo.points?
                                <>
                                    <img src={`/images/ranked-emblems/Emblem_${playerData.stats.currentSeason.soloDuo.tier}.png`} alt={playerData.stats.currentSeason.soloDuo.tier} />
                                    <div className="stats">
                                        <p className="tier" style={{ color: rankColors[playerData.stats.currentSeason.soloDuo.tier.toLowerCase()] }}>{playerData.stats.currentSeason.soloDuo.tier + " " + playerData.stats.currentSeason.soloDuo.rank}</p>
                                        <div className="points">
                                            <p className="points">{playerData.stats.currentSeason.soloDuo.points + "LP"}</p>
                                            <p className="wins">{playerData.stats.currentSeason.soloDuo.wins}W</p>
                                            <p className="losses">{playerData.stats.currentSeason.soloDuo.losses}P</p>
                                        </div>
                                        <p className="win-ratio">Win Ratio {playerData.stats.currentSeason.soloDuo.winRatio}%</p>
                                    </div>
                                </>
                                : <p className="unranked">Unranked</p>
                            }
                        </div>
                        <div className="rank">
                            <p className="queueType">Gra rankingowa Flex 5v5</p>
                            {playerData.stats.currentSeason.flex.points?
                                <>
                                    <img src={`/images/ranked-emblems/Emblem_${playerData.stats.currentSeason.flex.tier}.png`} alt={playerData.stats.currentSeason.flex.tier} />
                                    <div className="stats">
                                        <p className="tier" style={{ color: rankColors[playerData.stats.currentSeason.flex.tier.toLowerCase()] }}>{playerData.stats.currentSeason.flex.tier + " " + playerData.stats.currentSeason.flex.rank}</p>
                                        <div className="points">
                                            <p className="points">{playerData.stats.currentSeason.flex.points + "LP"}</p>
                                            <p className="wins">{playerData.stats.currentSeason.flex.wins}W</p>
                                            <p className="losses">{playerData.stats.currentSeason.flex.losses}P</p>
                                        </div>
                                        <p className="win-ratio">Win Ratio {playerData.stats.currentSeason.flex.winRatio}%</p>
                                    </div>
                                </>
                                : <p className="unranked">Unranked</p>
                            }
                        </div>
                    </div>

                    <div className="top-champions">
                        {
                            playerData.stats.topChampions.map(((champion, i) => {


                                return <div className="champion" key={i}>
                                    <img src={`https://ddragon.leagueoflegends.com/cdn/${process.env.REACT_APP_LOL_PATCH}/img/champion/${champion.formattedName}.png`} alt="avatar" />

                                    <div className="kda">
                                        <img src="/images/icons/kda.svg" alt="kda" />
                                        <span style={{ color: getKdaColor(champion.kda) }}>{champion.kda}</span>

                                        <img src="/images/icons/minions.svg" alt="minions" />
                                        { champion.csPerSecond }
                                    </div>

                                    <div className="games">
                                        <img src="/images/icons/games.svg" alt="games" />
                                        {champion.games}
                                    </div>

                                    <div className="win-ratio">
                                        <svg viewBox="0 0 36 36">
                                            <path className="circle-bg"
                                                d="M18 2.0845
                                                a 15.9155 15.9155 0 0 1 0 31.831
                                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                            />
                                            <path style={{ stroke: wrColor[roundWinRatio(champion.winRatio)] }} className="circle"
                                                strokeDasharray={champion.winRatio + ", 100"}
                                                d="M18 2.0845
                                                a 15.9155 15.9155 0 0 1 0 31.831
                                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                            />
                                        </svg>
                                        <span className="percentage">{champion.winRatio}</span>
                                    </div>
                                </div>
                            }
                            ))
                        }
                        <button>Pokaż więcej</button>
                    </div>
                </div>

                <div className="center">
                    <div className="menu"></div>
                    <div className="content">
                        <Matches playerData={playerData}/>
                    </div>
                </div>
            </div>

        </>
        : playerDataLoadError
           ? <h1>Błąd</h1>
           : <div className="loading-circle"></div>
    )
}

export default Player