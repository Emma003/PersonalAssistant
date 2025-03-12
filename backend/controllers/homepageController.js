

//get homepage info (username + quote + author)
const getHomepageInfo = (req, res) => {

    //fetch quote from quotes-api-self API
    try {
        fetch("https://quotes-api-self.vercel.app/quote")
            .then(response => response.json())
            .then(data => res.status(200).json({
                username: 'johnny doe', 
                quote: data.quote, 
                author: data.author
            })
        );
            
    } catch (error) {
        res.status(400).json({message: error.message});
    }
    
}


//export functions
module.exports = {
    getHomepageInfo
}