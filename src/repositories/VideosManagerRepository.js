class VideosManagerRepository {
    #videosManagerDAO;
    
    constructor(videosManagerDAO) {
        this.#videosManagerDAO = videosManagerDAO;

        this.getVideosAsync = this.getVideosAsync.bind(this);
        this.addVideoAsync = this.addVideoAsync.bind(this);
        this.updateVideoAsync = this.updateVideoAsync.bind(this);
        this.deleteVideoAsync = this.deleteVideoAsync.bind(this);
        this.getVideoByIdAsync = this.getVideoByIdAsync.bind(this);
        
    }

    async getVideosAsync() {
        return await this.#videosManagerDAO.getVideosAsync();
    }

    async addVideoAsync(video) {
        return await this.#videosManagerDAO.addVideoAsync(video);

    }

    async updateVideoAsync(videoActualizada) {
        return await this.#videosManagerDAO.updateVideoAsync(videoActualizada);
    }

    async deleteVideoAsync(idVideo) {
        return await this.#videosManagerDAO.deleteVideoAsync(idVideo);
    }

    async getVideoByIdAsync(idVideo) {
        return await this.#videosManagerDAO.getVideoByIdAsync(idVideo);
    }

    
}

export default VideosManagerRepository;