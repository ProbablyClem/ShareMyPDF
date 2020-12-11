class Salon{
    constructor(pdf, code, presentateurIp, presentateurPseudo){
        this.membres = {};
        this.presentateurIp = presentateurIp;
        this.presentateurPseudo = presentateurPseudo;
        this.presentateurId = "";
        this.code = code;
        this.pdf = pdf;
        this.pageProf = 1;
        this.annotations = [];
    }

    addMembre(pseudo, id){
        if(pseudo == this.presentateurPseudo){
            this.presentateurId = id;
        }
        else{
            this.membres[pseudo] = id;
        }
    }

    setPage(page){
        this.pageProf = page;
        console.log(io.to(this.code));
        io.to(this.code).emit('page', parseInt(page));
    }

    
}

module.exports = Salon;