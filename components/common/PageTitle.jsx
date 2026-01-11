import React from "react";

export default function PageTitle({ title = "Page Title" }) {
  return (
    <div className="page-title basic" style={{ background: '#fff', paddingTop: '120px', paddingBottom: '60px' }}>
      <div className="tf-container full">
        <div className="row">
          <div className="col-12">
            <div className="content text-center">
              <h2 className="font-cardo fw-7" style={{ color: '#1f2937' }}>{title}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
