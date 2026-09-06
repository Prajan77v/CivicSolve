import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const {
      name,
      email,
      password,
      role = 'CITIZEN',
      organization,
      skills,
      department,
      designation,
    } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required', success: false },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists', success: false },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const upperRole = role.toUpperCase()

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: upperRole,
        bio: organization ? `${upperRole} at ${organization}` : undefined,
        verified: upperRole === 'CITIZEN' ? false : true,
      },
    })

    // If student, create student profile
    if (upperRole === 'STUDENT') {
      const skillsArray = skills
        ? Array.isArray(skills)
          ? skills
          : skills.split(',').map((s: string) => s.trim())
        : ['Python', 'IoT', 'Problem Solving']

      await prisma.student.create({
        data: {
          userId: newUser.id,
          skills: JSON.stringify(skillsArray),
          yearOfStudy: 3,
          impactScore: 50,
        },
      })
    } else if (upperRole === 'FACULTY') {
      const specs = skills
        ? Array.isArray(skills)
          ? skills
          : skills.split(',').map((s: string) => s.trim())
        : ['Environmental Engineering', 'Data Analytics']

      await prisma.faculty.create({
        data: {
          userId: newUser.id,
          specializations: JSON.stringify(specs),
          designation: designation || 'Assistant Professor',
        },
      })
    }

    return NextResponse.json(
      {
        data: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
        message: 'Account created successfully',
        success: true,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error during registration:', error)
    return NextResponse.json(
      { error: 'Failed to create user account. Please try again.', success: false },
      { status: 500 }
    )
  }
}
