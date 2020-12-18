class Salon{
    constructor(pdf, code, presentateurIp, presentateurPseudo){
        this.membres = [];
        this.presentateurIp = presentateurIp;
        this.presentateurPseudo = presentateurPseudo;
        this.code = code;
        this.pdf = pdf;
        this.pageProf = 1;
    }
}

module.exports = Salon