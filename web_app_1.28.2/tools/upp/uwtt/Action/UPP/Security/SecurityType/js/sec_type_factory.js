function SecurityTypeFactory() {}
SecurityTypeFactory.create = function(sec_type) {
        if(sec_type === 'info') return new SecInfo(sec_type);
        else if(sec_type.startsWith('rsa')) return new Rsa(sec_type);
        else if(sec_type.startsWith('voltage')) return new Voltage(sec_type);
        else if (sec_type == 'maccalculation') return new MacCalculation(sec_type);
        else if (sec_type == 'macverification') return new MacVerification(sec_type);
        else if (sec_type == 'injectsessionkey') return new InjectSessionKey(sec_type);
}
