console.info('[sola]: extension injected')

var solaLogin = new SolaLogin()
window.addEventListener("message", (event) => {
    if (event.source !== window) {
        return
    }

    // login event
    if (event.data.type && (event.data.type === "SOLA_LOGIN")) {
        solaLogin.login(event.data.user_id, event.data.user_domain, event.data.auth_token, event.data.avatar)
    }

    // logout event
    if (event.data.type && (event.data.type === "SOLA_LOGOUT")) {
        solaLogin.logout()
    }
}, false)

function SolaLogin () {
    /**
     * Login method
     * @param user_id
     * @param user_domain
     * @param auth_token
     * @param avatar
     */
    this.login = function (user_id, user_domain, auth_token, avatar) {
        chrome.storage.local.set({
            user_id: user_id,
            user_domain: user_domain,
            auth_token: auth_token,
            avatar: avatar,
        })
    }

    this.logout = function () {
        chrome.storage.local.set({
            user_id: '',
            user_domain: '',
            auth_token: '',
            avatar: ''
        })
    }
}
