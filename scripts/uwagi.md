# Uwagi odnośnie testów integracji frontendu

## Zmienne środowiskowe 

Program korzysta ze zmiennych środowiskowych definiowanych w pliku *.env*, 
który można wczytać za pomocą importu
```js
require('dotenv').config();
```
Następnie, wszystkie stałe będą dostępne pod **process.env.NAZWA_STAŁEJ**.


Kategoryzacja dostępnych pól:
- Pinata API
  - Obejmuje: *PINATA_API_KEY*, *PINATA_API_SECRET*, *PINATA_API_JWT*
  - Używane do integracji z IPFS za pośrednictwem platformy Pinata
  - Najpewniej niepotrzebne do testów frontendu
- Alchemy
  - Obejmuje: *API_KEY*, *API_URL*
- Adres kontraktu **CONTRACT_ADDRESS** 
  - Adres kontraktu solidity po jego wypchnięciu na blockchain
  - Potrzebny do wszelkiej interakcji z kontraktem
  - Aktualizowany po każdym wypchnięciu kontraktu w celu zaaplikowania zmian jego składni
- Portfele #1 i #2:
  - Do każdego mamy ID (używane jako adres docelowy w przypadku mintowania i transferów) oraz **prywatny** klucz
  potrzebny do autoryzacji tych czynności (zazwyczaj poprzez tworzenie na ich podstawie obiektu ethers.Wallet 
  wykorzystywanego do interackji z kontraktem) 


## Przewidziane *use-case*'y

- id utworu i właściciela żeby sprawdzić czy jest to jego własność, 
  jakiś przypadek który miałby sprawdzić czy jest to prawda

- Plus czy bedzie funkcja ktora zwroci wszystkie dodane utwory zeby wyswietlic je do kupna?

- no w sumie tutaj to do przemyślenia, podstawowo to najlepiej by było pobrać tokeny z kontraktu własności,
i wyświetlić je jakoś, nawet id i jego cenę. i wtedy do kupna wybieramy prawa na jakich chcemy go kupić,
taka podstawowa wersja.

- Kupno na wybranych prawach, pobrać dostępne utwory z tego pierwszego kontraktu. i 
 wywołanie funkcji zakupu z innego odpowiedniego do wybranej opcję

- Wyświetlenie wszystkich utworów które należą do usera o danym id, 
  i tutaj to pewnie by był wywoływany 'geter' dla każdego kontraktu

- Czyli z tego pierwszego kontraktu bysmy dodawali nowy utwór, mint? 
  plus ewentualnie pobranie tych utworów jako baze utworów ktore są dostępne do kupna

Kontrakt tokenów własności musi zawierać:
  - identyfikator utworu (ew. jako id)
  - informacje o licencjonowaniu:
    - dostępne rodzaje licencji
    - ich ceny



### A 

### B