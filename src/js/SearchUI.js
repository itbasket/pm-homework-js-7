import debounce from './utils/debounce.js'
import httpService from './HttpService.js'

export default class SearchUI {
    constructor() {
        this.searchInput = document.querySelector('.searchInput')
        this.userInfo = document.querySelector('.userInfo')
        this.userError = document.querySelector('.userError')

        this.registerListeners = this.registerListeners.bind(this)
        this.searchHandler = this.searchHandler.bind(this)

        this.registerListeners()
    }

    registerListeners() {
        this.searchInput.addEventListener('input', debounce(this.searchHandler, 500))
        this.searchInput.addEventListener('keypress', (event) => {if (event.key === 'Enter') {event.preventDefault()}})
    }

    searchHandler(event) {
        const login = this.userInfo.querySelector('.userLogin')
        const avatar = this.userInfo.querySelector('.userAvatar')
        const repos = this.userInfo.querySelector('.userRepos')
        const followers = this.userInfo.querySelector('.userFollowers')

        const username = event.target.value

        httpService.request({method: 'GET', path: `/users/${username}`})
            .then(user => {
                    this.userError.classList.add('hidden')
                    this.userInfo.classList.add('hidden')

                    let userRepos = []
                    let userFollowers = []

                    const reposRequest = httpService.request({method: 'GET', path: `/users/${username}/repos`})
                        .then(data => {
                            userRepos = data.map(repo => {
                                return `<div><a href="${repo.html_url}" target="_blank">${repo.name}</a></div>`
                            })
                        })
                        .catch((e) => console.log(e.message))

                    const followersRequest = httpService.request({method: 'GET', path: `/users/${username}/followers`})
                        .then(data => {
                            userFollowers = data.map(follower => {
                                return `<div><a href="${follower.html_url}" target="_blank">${follower.login}</a></div>`
                            })
                        })
                        .catch((e) => console.log(e.message))

                Promise.all([reposRequest, followersRequest])
                    .then(() => {
                        login.innerHTML = `<a href="${user.html_url}" target="_blank">${user.login}</a>`
                        avatar.innerHTML = `<a href="${user.html_url}" target="_blank"><img src="${user.avatar_url} alt=""></a>`
                        repos.innerHTML = userRepos.join('')
                        followers.innerHTML = userFollowers.join('')

                        this.userInfo.classList.remove('hidden')
                    })
                }
            )
            .catch(() => {
                this.userInfo.classList.add('hidden')
                this.userError.classList.remove('hidden')
            })
    }
}
