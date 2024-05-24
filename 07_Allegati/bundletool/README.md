# Istruzioni d'uso
[Scaricare il bundletool](https://github.com/google/bundletool/releases)

Rinominare il bundlettol in bundletool.jar e spostarlo nella stessa cartella del file aab.

Eseguire il seguente comando
```bash
java -jar bundletool.jar build-apks --bundle=<nomefile>.aab --output=moviesurvey.apks --mode=universal
```
Fare un unzip del file apks ed estrarre il file universal.apk

Rinominare il file come si preferisce, per esempio moviesurvey.apk