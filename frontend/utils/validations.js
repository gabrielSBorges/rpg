export default {
  required() {
    return v => v && v.length > 0 || `Este campo é obrigatório!`
  },

  minLength(propertyType, minLength) {
    return v => v && v.length >= minLength || `${propertyType} deve ter pelo menos ${minLength} caracteres!`
  },

  maxLength(propertyType, maxLength) {
    return v => v && v.length <= maxLength || `${propertyType} deve ter no máximo ${maxLength} caracteres!`
  },

  emailFormat() {
    let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    return v => v && regex.test(v) || 'Email inválido!'
  }
}