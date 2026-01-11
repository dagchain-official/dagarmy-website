import React from "react";
const tags = [
  "Artificial Intelligence",
  "Blockchain Technology",
  "Cyber Security",
  "Data Visualization",
  "Machine Learning",
  "Smart Contracts",
  "Cloud Computing",
  "Web3 Development",
  "Python Programming",
];
export default function Skills() {
  return (
    <section className="section-search-tags tf-spacing-11">
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            <div className="heading-section text-center">
              <h2 className="font-outfit wow fadeInUp" data-wow-delay="0.1s">
                Master Future-Ready Tech Skills.&nbsp;Build Your Army.
              </h2>
              <div className="sub fs-15 wow fadeInUp" data-wow-delay="0.2s">
                Master cutting-edge technologies in AI, Blockchain, Cyber Security, Data Visualization and more. Join the global army of Vibe Coders.
              </div>
            </div>
            <div
              className="tags-list style3 wow fadeInUp"
              data-wow-delay="0.3s"
            >
              <ul className="tag-list">
                {tags.map((tag, index) => (
                  <li key={index} className="tag-list-item">
                    <a href="#">{tag}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
