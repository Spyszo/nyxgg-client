import "./Matches.scss"

import React, { useEffect, useState } from "react"

import { useHistory } from "react-router-dom"

import axios from "axios"

import runes from "../runesReforged.json"

import TimeAgo from "javascript-time-ago"

import pl from 'javascript-time-ago/locale/pl'


TimeAgo.addDefaultLocale(pl)

const timeAgo = new TimeAgo("en-Us")


const Matches = (props) => {

    const name = props.playerData.name

    const [matches, setMatches] = useState(null)
    const [matchesLoadError, setMatchesLoadError] = useState(false)

    const history = useHistory();

    const queueTypes = {
        400: "Draft Pick",
        420: "Ranked Solo",
        430: "Blind Pick",
        440: "Ranked Flex",
        450: "Aram",
        700: "Clash",
        900: "URF"
    }

    const summonerSpells = {
        3: `https://ddragon.leagueoflegends.com/cdn/${process.env.REACT_APP_LOL_PATCH}/img/spell/SummonerExhaust.png`,
        4: `https://ddragon.leagueoflegends.com/cdn/${process.env.REACT_APP_LOL_PATCH}/img/spell/SummonerFlash.png`,
        6: `https://ddragon.leagueoflegends.com/cdn/${process.env.REACT_APP_LOL_PATCH}/img/spell/SummonerBoost.png`,
        7: `https://ddragon.leagueoflegends.com/cdn/${process.env.REACT_APP_LOL_PATCH}/img/spell/SummonerHeal.png`,
        12: `https://ddragon.leagueoflegends.com/cdn/${process.env.REACT_APP_LOL_PATCH}/img/spell/SummonerTeleport.png`,
        11: `https://ddragon.leagueoflegends.com/cdn/${process.env.REACT_APP_LOL_PATCH}/img/spell/SummonerSmite.png`,
        14: `https://ddragon.leagueoflegends.com/cdn/${process.env.REACT_APP_LOL_PATCH}/img/spell/SummonerDot.png`,
        21: `https://ddragon.leagueoflegends.com/cdn/${process.env.REACT_APP_LOL_PATCH}/img/spell/SummonerBarrier.png`,
        32: `https://ddragon.leagueoflegends.com/cdn/${process.env.REACT_APP_LOL_PATCH}/img/spell/SummonerSnowball.png`
    }

    const getFirstRuneIcon = (perks) => {
        const runeStyleId = perks.styles[0].style
        const runeId = perks.styles[0].selections[0].perk


        const objectWithFirstRune = runes.filter(rune => rune.id === runeStyleId)[0]
        const iconPath = objectWithFirstRune.slots[0].runes.filter(rune => rune.id === runeId)[0].icon


        return "https://ddragon.canisback.com/img/" + iconPath
    }

    const getSecondRuneIcon = (perks) => {
        const runeStyleId = perks.styles[1].style
        const runeObject = runes.filter(rune => rune.id === runeStyleId)[0]

        const iconPath = runeObject.icon

        return "https://ddragon.canisback.com/img/" + iconPath
    }


    useEffect(() => {

        const fetchMatches = async () => {
            setMatches(null)
            setMatchesLoadError(false)
    
            const matches = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/matches/` + encodeURI(name)).then(res => res.data)
    
            //const matches = false
    
            if (!matches || matches === "error" || matches.length === 0) return setMatchesLoadError(true)
    
            matches.map(match => {
                console.log(match)
                return match.info.requestedSummoner = match.info.participants.filter(participant => {
                    return participant.summonerName.toLowerCase() === name.toLowerCase()
                })[0]
            })
    
            setMatches(matches)
        }

        fetchMatches()
    }, [name, props.playerData])

    const handleGoToSummoner = (name) => {
        history.push("/summoner/" + name)
    }

    return (
        matches ?
            <div className="matches">
                {matches.map((match, i) =>
                    <div className="match" key={i}>
                        <div className="basic-info">
                            <span className="game-type">{queueTypes[match.info.queueId]}</span>
                            <span className="game-date">{timeAgo.format(match.info.gameCreation)}</span>
                            <span className={"game-result " + (match.info.requestedSummoner.win ? "win" : "loss")}>{match.info.requestedSummoner.win ? "Wygrana" : "Przegrana"}</span>
                            <span className={"points " + (match.info.requestedSummoner.win ? "win" : "loss")}> -+ ? LP</span>
                        </div>
                        <div className="champion">
                            <div className="avatar">
                                <img src={`https://ddragon.leagueoflegends.com/cdn/${process.env.REACT_APP_LOL_PATCH}/img/champion/${match.info.requestedSummoner.championName}.png`} alt={match.info.requestedSummoner.championName} />
                            </div>
                            <div className="summoners">
                                <img src={summonerSpells[match.info.requestedSummoner.summoner1Id]} alt="summoner1" />
                                <img src={summonerSpells[match.info.requestedSummoner.summoner2Id]} alt={match.info.requestedSummoner.summoner2Id} />
                            </div>
                            <div className="runes">
                                <img src={getFirstRuneIcon(match.info.requestedSummoner.perks)} alt="rune1" />
                                <img src={getSecondRuneIcon(match.info.requestedSummoner.perks)} alt="rune2" />
                            </div>
                        </div>
                        <div className="stats">
                            <div className="numbers">
                                <span className="kills">{match.info.requestedSummoner.kills}</span>
                                <span className="deaths">{match.info.requestedSummoner.deaths}</span>
                                <span className="assists">{match.info.requestedSummoner.assists}</span>
                            </div>
                            <div className="minions">
                                <span className="number">{match.info.requestedSummoner.totalMinionsKilled} </span>CS
                                ({(Math.round(((match.info.requestedSummoner.totalMinionsKilled + match.info.requestedSummoner.neutralMinionsKilled) / (match.info.gameDuration / 1000 / 60)) * 10) / 10).toFixed(1)})
                            </div>
                            <div className="carry-points">108</div>
                        </div>
                        <div className="items">
                            <div className="item">{match.info.requestedSummoner.item0 !== 0 && <img src={`https://ddragon.leagueoflegends.com/cdn/${process.env.REACT_APP_LOL_PATCH}/img/item/${match.info.requestedSummoner.item0}.png`} alt="item" />}</div>
                            <div className="item">{match.info.requestedSummoner.item1 !== 0 && <img src={`https://ddragon.leagueoflegends.com/cdn/${process.env.REACT_APP_LOL_PATCH}/img/item/${match.info.requestedSummoner.item1}.png`} alt="item" />}</div>
                            <div className="item">{match.info.requestedSummoner.item2 !== 0 && <img src={`https://ddragon.leagueoflegends.com/cdn/${process.env.REACT_APP_LOL_PATCH}/img/item/${match.info.requestedSummoner.item2}.png`} alt="item" />}</div>
                            <div className="item">{match.info.requestedSummoner.item3 !== 0 && <img src={`https://ddragon.leagueoflegends.com/cdn/${process.env.REACT_APP_LOL_PATCH}/img/item/${match.info.requestedSummoner.item3}.png`} alt="item" />}</div>
                            <div className="item">{match.info.requestedSummoner.item4 !== 0 && <img src={`https://ddragon.leagueoflegends.com/cdn/${process.env.REACT_APP_LOL_PATCH}/img/item/${match.info.requestedSummoner.item4}.png`} alt="item" />}</div>
                            <div className="item">{match.info.requestedSummoner.item5 !== 0 && <img src={`https://ddragon.leagueoflegends.com/cdn/${process.env.REACT_APP_LOL_PATCH}/img/item/${match.info.requestedSummoner.item5}.png`} alt="item" />}</div>
                            <div className="item ward">{match.info.requestedSummoner.item6 !== 0 && <img src={`https://ddragon.leagueoflegends.com/cdn/${process.env.REACT_APP_LOL_PATCH}/img/item/${match.info.requestedSummoner.item6}.png`} alt="item" />}</div>
                        </div>
                        <div className="participants">
                            {
                                match.info.participants.map((participant, i) => {
                                    if (participant.championName === "FiddleSticks") participant.championName = "Fiddlesticks"
                                    return <div key={i} className={"participant " + (participant.summonerName === match.info.requestedSummoner.summonerName && "currentSummoner")} onClick={()=>handleGoToSummoner(participant.summonerName)}>
                                        <img src={`https://ddragon.leagueoflegends.com/cdn/${process.env.REACT_APP_LOL_PATCH}/img/champion/${participant.championName}.png`} alt="champ" />
                                        <span>{participant.summonerName.length > 5 ? participant.summonerName.slice(0, 8) + "..." : participant.summonerName}</span>
                                    </div>
                                })
                            }
                        </div>


                    </div>)}
            </div>
            : matchesLoadError ? 
                <h1>Wystąpił błąd</h1> 
                :  <div className="loading-circle"></div>
    )
}

export default Matches