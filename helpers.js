function convertTime(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  // var hour = a.getHours();
  // var min = a.getMinutes();
  // var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ';

  // допилить вывод для даты + время
  return time;
}




module.exports = {
  convertTime
}