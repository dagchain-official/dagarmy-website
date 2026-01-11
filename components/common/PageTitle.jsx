import React from "react";
import Link from "next/link";

export default function PageTitle({ title = "Page Title", subtitle = "" }) {
  return (
    <div className="page-title basic" style={{ background: '#fff', paddingTop: '120px', paddingBottom: '60px' }}>
      <div className="tf-container full">
        <div className="row">
          <div className="col-12">
            <div className="content text-center">
              <ul className="breadcrumbs flex items-center justify-center gap-10">
                <li>
                  <Link href={`/`} className="flex">
                    <i className="icon-home" />
                  </Link>
                </li>
                <li>
                  <i className="icon-arrow-right" />
                </li>
                <li>{title}</li>
              </ul>
              <h2 className="font-cardo fw-7" style={{ marginTop: '20px', color: '#1f2937' }}>{title}</h2>
              {subtitle && (
                <h6 style={{ color: '#6b7280', marginTop: '10px' }}>
                  {subtitle}
                </h6>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
