import React from "react";
import Link from "next/link";

export default function PageTitle({ title = "DAGARMY Blog" }) {
  return (
    <div className="page-title basic">
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
                <li>Blog</li>
              </ul>
              <h2 className="font-cardo fw-7">{title}</h2>
              <h6>
                Insights on AI, Blockchain, and Data Visualization from the Vibe Coder Army
              </h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
