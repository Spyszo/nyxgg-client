import "./Header.scss"
import React from "react"
import { useHistory } from "react-router-dom"

const Header = () => {

    const history = useHistory();


    const handleSubmitSearch = (e) => {
        e.preventDefault()
        history.push("/summoner/" + e.target[0].value)
    }

    const handleHomePage = () => {
        history.push("/")
    }

    return (
        <header>
            <div>
                <div className="logo" onClick={handleHomePage}>
                    <span>GG</span>
                    <div className="main">NyX</div>
                    <span>GG</span>
                </div>
            </div>
            <div className="search-bar">
                <form action="" onSubmit={ handleSubmitSearch }>
                    <input type="text" placeholder="Nazwa przywoływacza"/>
                </form>
            </div>
            <div className="empty"></div>
        </header>
    )
}

export default Header