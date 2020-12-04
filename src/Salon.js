class Salon{
    constructor(membres, pdf){
        this.membres = membres;
        this.code = getCode();
        this.pdf = pdf;
        this.pageProf = 1;
    }

    getCode(){
        let length = 6;
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}

module.exports = Salon