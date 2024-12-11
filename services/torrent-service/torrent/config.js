export const axiosConfig = {
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36"
    }
};

export const handleError = (error, source) => {
    console.log(`Error in ${source}:`, error.message);
    return null;
}; 