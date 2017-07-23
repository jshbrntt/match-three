import Image from 'image'
import ServiceLocator from '../service-locator'
import io from 'socket.io-client'
// ServiceLocator.provide('Socket', io(`${location.hostname}:3000`))
export default class GoogleSignIn {
  static onSignIn (googleUser) {
    let basic = googleUser.getBasicProfile()
    let profile = {
      id: basic.getId(),
      name: basic.getName(),
      imageUrl: basic.getImageUrl()
    }
    GoogleSignIn.addProfile(profile)
    // GoogleSignIn.socket.emit('signin', profile)
  }
  static addProfile (profile) {
    let profileImage = document.querySelector(`.players [id='${profile.id}']`)
    if (profileImage) {
      return
    }
    profileImage = new Image()
    profileImage.className = 'profile-image'
    profileImage.src = profile.imageUrl
    profileImage.alt = profile.name
    profileImage.id = profile.id
    document.querySelector('.players').appendChild(profileImage)
  }
  static removeProfile (profile) {
    let profileImage = document.querySelector(`.players [id='${profile.id}']`)
    profileImage.parentNode.removeChild(profileImage)
  }
}
// GoogleSignIn.socket = ServiceLocator.get('Socket')
// GoogleSignIn.socket.on('signin', data => {
//   GoogleSignIn.addProfile(data)
// })
// GoogleSignIn.socket.on('signout', data => {
//   GoogleSignIn.removeProfile(data)
// })
