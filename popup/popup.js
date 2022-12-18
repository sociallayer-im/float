// profile: {'user_id', 'user_domain', 'auth_token', 'avatar'}
chrome.storage.local
    .get(['user_id', 'user_domain', 'auth_token', 'avatar', 'login_twitter_id'])
    .then(function(profile){
        if (!profile.user_id) return

        var profileView = document.querySelector('#profile-view')
        profileView.querySelector('.name').innerHTML = profile.user_domain

        if (profile.avatar) {
           profileView.querySelector('.avatar').setAttribute('src', profile.avatar)
        }

        if (profile.login_twitter_id) {
           updateTwitterId(profile.login_twitter_id, profileView, profile.user_domain.split('.')[0])
        } else {
           setEmpty(profileView)
        }

        var loginView = document.querySelector('#login-view')
        loginView.style.display = 'none'
        profileView.style.display = 'block'
    })

function updateTwitterId (id, profileView, solaName) {
     const dom =  document.createElement('div')
        dom.className = 'connected-item'
        dom.innerHTML = `<div class="info">
                        <img src="./assets/twitter.png" alt="">
                        <div class="info-name">
                            <div class="sola-name">${solaName}</div>
                            <div class="social-name">${id}</div>
                        </div>
                    </div>
                    <div class="actions">
                        <button>Disconnect</button>
                    </div>`
        profileView.querySelector('.connected').appendChild(dom)
}

function setEmpty (profileView) {
    if (!profileView) return
    const dom =  document.createElement('div')
    dom.className = 'nothing'
    dom.innerHTML = `No Account connected yet~`
    const box = profileView.querySelector('.connected')
    if (box) box.appendChild(dom)
}
