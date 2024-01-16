import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslatorService {
  dictionary: {word: string, translate: string}[] = [
    {word: 'firstName', translate: 'Name'},
    {word: 'lastName', translate: 'Surname'},
    {word: 'email', translate: 'Email'},
    {word: 'phoneNumber', translate: 'Phone number'},
    {word: 'registeredAt', translate: 'Registered at'}
  ]
  constructor() { }

  translate(word: string) {
    return this.dictionary.find(translation => translation.word === word)?.translate || word;
  }

  translateBack(translation: string) {
    return this.dictionary.find(word => word.translate === translation)?.word || translation;
  }
}
