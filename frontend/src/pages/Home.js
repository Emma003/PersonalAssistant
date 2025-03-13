import { useEffect, useState } from "react";
import BackgroundVideo from "../components/BackgroundVideo";
import Navbar from "../components/Navbar";

const Home = () => {

    const [username, setUsername] = useState('');
    const [quote, setQuote] = useState('');
    const [author, setAuthor] = useState('');

    const date = new Date();
    const dateString = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();

    useEffect(() => { 

        const fetchQuote = async () => {
            const response = await fetch('/api/home');
            const json = await response.json();
            
            if(response.ok) {
                console.log(json);
                setUsername(json.username);
                setQuote(json.quote);
                setAuthor(json.author);
            }   
        }

        fetchQuote();
    }
    , []); // only fire once when component is rendered (empty dependency array)

    return (
        <div className="home" >
            <BackgroundVideo />
            <h1>space</h1>
            <h2 className="welcome-message">welcome, {username}:</h2>
            <Navbar />
            <div className="quote">
                <p >daily quote | {dateString}</p>
                <h3><strong>"{quote.toLowerCase()}"</strong></h3>
                <p style={{ textAlign: 'right', marginRight: '10px' }}>- {author.toLowerCase()}</p>
            </div>
            
        </div>
    );
}

export default Home;