-- Update course description and mission to fix duplication
UPDATE courses 
SET 
  description = 'Transforming Talent into Market-Ready Tech Leaders through Community Service Resources (CSR)',
  mission = 'Empowering individuals to master AI, Blockchain, and Data Visualization through hands-on learning and community-driven initiatives. We bridge the gap between traditional education and industry demands.'
WHERE slug = 'next-gen-tech-architect-program';
