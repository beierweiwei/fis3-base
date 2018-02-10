(function () {
  let container = $('.container');
  $('#j-scroll-btn-down').click(() => {
    container[0].scrollTo(0, container.height())
  })
  $('#j-scroll-btn-up').click(() => {
    container[0].scrollTo(0, 0)
  })
})()