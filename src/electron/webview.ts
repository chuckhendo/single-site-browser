// window.onbeforeunload = function(e) {
//   return 'Dialog text here.';
// };
console.log('wat');
window.addEventListener('onbeforeunload', () => {
  console.log('MOVING');
});
