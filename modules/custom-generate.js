module.exports = function () {
  this.nuxt.hook('generate:extendRoutes', async routes => {
    const routesToGenerate = routes.filter(page => page.route.indexOf('/index.html') === -1)
    routes.splice(0, routes.length, ...routesToGenerate)
  })
}
