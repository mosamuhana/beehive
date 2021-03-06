import { DataService } from '@beehive/data'
import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateCourseInput } from './dto/create-course.input'
import { CreateLessonInput } from './dto/create-lesson.input'
import { UpdateCourseInput } from './dto/update-course.input'
import { UpdateLessonInput } from './dto/update-lesson.input'

@Injectable()
export class CourseService {
  private readonly courseIncludes = {
    author: true,
    lessons: true,
  }

  constructor(private readonly data: DataService) {}
  public courses() {
    return this.data.course.findMany({ include: this.courseIncludes })
  }

  public async course(id: number) {
    const found = await this.data.course.findOne({
      where: { id },
      include: this.courseIncludes,
    })
    if (!found) {
      throw new NotFoundException(`Course with id ${id} not found!`)
    }
    return found
  }

  public createCourse(userId: number, input: CreateCourseInput) {
    return this.data.course.create({
      data: {
        ...input,
        author: { connect: { id: userId } },
      },
    })
  }

  public async updateCourse(userId: number, id: number, input: UpdateCourseInput) {
    const course = await this.course(id)

    return this.data.course.update({
      where: { id: course.id },
      data: { ...input },
    })
  }

  public async deleteCourse(userId: number, id: number) {
    const deleted = await this.data.course.delete({
      where: {
        id,
      },
    })
    return !!deleted
  }

  public async createLesson(userId: number, courseId: number, input: CreateLessonInput) {
    const course = await this.course(courseId)

    return this.data.lesson.create({
      data: {
        course: {
          connect: { id: course.id },
        },
        ...input,
      },
    })
  }

  public updateLesson(userId: number, lessonId: number, input: UpdateLessonInput) {
    return this.data.lesson.update({
      where: { id: lessonId },
      data: { ...input },
    })
  }

  public async deleteLesson(userId: number, lessonId: number) {
    // TODO: Check if userId can actually delete this?
    const deleted = await this.data.lesson.delete({ where: { id: lessonId } })

    return !!deleted
  }
}
