export const rekursiyaLessonPublication = Object.freeze({
  id: "rekursiya",
  routeSlug: "16-rekursiya",
  taskNumbers: Object.freeze([16]),
  title: "Рекурсивные алгоритмы",
  summary:
    "Вычисление значений функции, заданной через саму себя: от одного базового случая до больших аргументов и алгебраических сокращений.",
  status: "published",
});

export const preobrazovanieZapiseyChiselLessonPublication = Object.freeze({
  id: "preobrazovanie-zapisey-chisel",
  routeSlug: "5-preobrazovanie-zapisey-chisel",
  taskNumbers: Object.freeze([5]),
  title: "Преобразование записей чисел",
  summary:
    "Как перевести число в заданную систему, изменить запись по алгоритму и безопасно найти исходное число или результат.",
  status: "published",
});

export const lessonPublications = Object.freeze([
  rekursiyaLessonPublication,
  preobrazovanieZapiseyChiselLessonPublication,
]);
