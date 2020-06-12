import { mapGetters, mapMutations, mapActions } from 'vuex'

export const playlistMixin = {
    computed: {
        ...mapGetters(['playList'])
    },
    watch: {
        playList() {
            this.handlePlaylist(this.playList)
        }
    },
    mounted() {
        this.handlePlaylist(this.playList)
    }
}