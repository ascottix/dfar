function Footer(props) {
  return (
    <div className="footer-box">
      <div id="message" className={props.error != null ? "error" : props.info ? "info" : ""}>
        <div className="error" aria-live="assertive">
          <span className="material-icons-outlined">warning_amber</span>
          {typeof props.error == "string" ? props.error : "Il valore inserito non è valido."}
        </div>
        <div className="info" aria-live="polite">
          <span className="material-icons-outlined">info</span>
          <span dangerouslySetInnerHTML={{ __html: props.info }}></span>
        </div>
      </div>
    </div>
  );
}

export default Footer;
