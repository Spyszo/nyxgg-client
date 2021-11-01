import "./Home.scss"
import { useHistory } from "react-router-dom"

const Home = () => {

    const history = useHistory();

    const handleSubmitSearch = (e) => {
        e.preventDefault()
        history.push("/summoner/" + e.target[0].value)
    }

    const handleGoToSummoner = (name) => {
        history.push("/summoner/" + name)
    }
    

    return (
        <div className="home">
            <div className="logo">
                    <span>GG</span>
                    <div className="main">NyX</div>
                    <span>GG</span>
                </div>
            <div className="search-bar"></div>

            <div className="search-bar">
                <form action="" onSubmit={ handleSubmitSearch }>
                    <input placeholder="Nazwa przywoływacza" type="text"/>
                </form>
            </div>

            <div className="followedSummoners">
                {
                    localStorage.getItem("followedSummoners") &&
                    JSON.parse(localStorage.getItem("followedSummoners")).map((summoner, i) => 
                        <div className="summoner" key={i} onClick={()=>handleGoToSummoner(summoner.name)}>
                            <img src={`https://ddragon.leagueoflegends.com/cdn/${process.env.REACT_APP_LOL_PATCH}/img/profileicon/${summoner.iconId}.png`} alt="icon" />
                            <p>{summoner.name}</p>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Home