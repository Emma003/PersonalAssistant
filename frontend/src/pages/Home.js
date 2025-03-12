import { useEffect, useState } from "react";

const Home = () => {

    const [username, setUsername] = useState('');
    const [quote, setQuote] = useState('');
    const [author, setAuthor] = useState('');

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
        <div className="home">
            <h1>Home</h1>
            <h2>Welcome, {username}!</h2>
            <p>{quote}</p>
            <p>- {author}</p>
        </div>
    );
}

export default Home;