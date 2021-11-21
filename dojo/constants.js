define([], function () {
  return {
    ChannelApp: "app", // Canale per messaggi dai widget verso l'app
    ChannelWidget: "widget", // Canale per messaggi dall'app verso i widget

    SetError: "setError", // Stato di errore associato ad un input non valido
    SetErrorMsg: "setErrorMsg", // Messaggio di errore
    SetIcon: "setIcon", // Icona associata al tipo di unità di misura
    SetInfoMsg: "setInfoMsg", // Messaggio informativo
    SetType: "setType", // Tipo di unità di misura (area, lunghezza, ecc.)
    SetUnit: "setUnit", // Unità di misura
    SetValue: "setValue" // Valore (da convertire o da impostare)
  };
});
