import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslatorService {
  dictionary: {word: string, translate: string}[] = [
    {word: 'firstName', translate: 'Iм\'я'},
    {word: 'lastName', translate: 'Прiзвище'},
    {word: 'email', translate: 'Пошта'},
    {word: 'phoneNumber', translate: 'Номер телефону'},
    {word: 'registeredAt', translate: 'Зареєстровано'}
  ]
  constructor() { }

  translate(word: string) {
    return this.dictionary.find(translation => translation.word === word)?.translate || word;
  }

  translateBack(translation: string) {
    return this.dictionary.find(word => word.translate === translation)?.word || translation;
  }
}
