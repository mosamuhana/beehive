import { DataModule } from '@beehive/data'
import { Module } from '@nestjs/common'
import { CourseResolver } from './resolvers/course.resolver'
import { CourseService } from './course.service'
import { LessonResolver } from './resolvers/lesson.resolver'

@Module({
  controllers: [],
  imports: [DataModule],
  providers: [CourseResolver, CourseService, LessonResolver],
  exports: [],
})
export class CourseModule {}
