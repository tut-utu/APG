class ExpressError extends Error {
    constructor(message,statuesCode){
        super();
        this.message = message;
        this.statuesCode = statuesCode;
    }
}

module.exports = ExpressError;