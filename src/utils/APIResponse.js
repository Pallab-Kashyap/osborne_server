class APIResponse {
    constructor(message = 'success', data = null){
        this.status = true
        this.message = message
        this.data = data
    }

    static success(res, message, data){
        res.status(200).json(
            new APIResponse(message, data)
        )
    }

    static created(res, message, data){
        res.status(201).json(
            new APIResponse(message, data)
        )
    }
}

module.exports = APIResponse