export default {
    methods: {
        cancel() {
            this.$router.back()
        },
        setAccountAvatarColor() {
            let letters= '0123456789ABCDEF'.split('');
            let color_cd= '';
            for (let i= 0; i < 6; i++ ) {
                color_cd += letters[Math.floor(Math.random() * 16)];
            }
            return color_cd;
        },
    }
    
}