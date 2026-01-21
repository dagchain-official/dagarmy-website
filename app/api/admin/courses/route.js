import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const newCourse = await request.json();

    // Validate required fields
    if (!newCourse.title || !newCourse.instructor) {
      return NextResponse.json(
        { error: 'Title and Instructor are required' },
        { status: 400 }
      );
    }

    // Read existing courses
    const coursesFilePath = path.join(process.cwd(), 'data', 'dagarmy-courses.js');
    let fileContent = fs.readFileSync(coursesFilePath, 'utf8');

    // Parse the existing courses array
    const coursesMatch = fileContent.match(/export const dagarmyCourses = \[([\s\S]*)\];/);
    if (!coursesMatch) {
      return NextResponse.json(
        { error: 'Could not parse courses file' },
        { status: 500 }
      );
    }

    // Format the new course object
    const newCourseString = `
  {
    id: ${newCourse.id},
    imgSrc: "${newCourse.imgSrc}",
    title: "${newCourse.title}",
    lessons: ${newCourse.lessons},
    students: ${newCourse.students},
    hours: ${newCourse.hours},
    duration: "${newCourse.duration}",
    rating: ${newCourse.rating},
    reviews: ${newCourse.reviews},
    totalReviews: ${newCourse.totalReviews},
    author: "${newCourse.instructor}",
    instractors: ${JSON.stringify(newCourse.instractors)},
    level: ${JSON.stringify(newCourse.level)},
    language: ${JSON.stringify(newCourse.language)},
    price: ${newCourse.price},
    features: ${JSON.stringify(newCourse.features)},
    accessLevel: "${newCourse.accessLevel}",
    badges: ${JSON.stringify(newCourse.badges)},
    filterCategories: ${JSON.stringify(newCourse.filterCategories)},
  },`;

    // Insert the new course at the end of the array (before the closing bracket)
    const updatedContent = fileContent.replace(
      /(\];)$/,
      `${newCourseString}\n];`
    );

    // Write back to file
    fs.writeFileSync(coursesFilePath, updatedContent, 'utf8');

    return NextResponse.json({
      success: true,
      message: 'Course created successfully',
      course: newCourse
    });

  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course: ' + error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Read courses file
    const coursesFilePath = path.join(process.cwd(), 'data', 'dagarmy-courses.js');
    const fileContent = fs.readFileSync(coursesFilePath, 'utf8');

    return NextResponse.json({
      success: true,
      message: 'Courses fetched successfully'
    });

  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}
