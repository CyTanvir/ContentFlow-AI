import React, { useEffect, useState } from "react";
import "./App.css";

function PendingReview() {
return (
    <section className="panel" style={{ marginTop: 5 }} aria-labelledby="pendingreview-heading">
      <h2 id="pendingreview-heading" style={{ margin: 0, marginBottom: 8 }}>Pending Review</h2>
        <p>No items pending review.</p>
        </section>
    );
}

export default PendingReview;