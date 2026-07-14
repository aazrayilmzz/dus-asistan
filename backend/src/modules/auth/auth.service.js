const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authRepository = require('./auth.repository');

const SALT_ROUNDS = 10;

async function registerUser({ email, password, fullName, targetSpecialty, targetScore, targetExamDate }) {
    const existingUser = await authRepository.findByEmail(email);
    if (existingUser) {
        const error = new Error('Bu e-posta adresi zaten kayıtlı.');
        error.statusCode = 409;
        throw error;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    return authRepository.createUser({
        email,
        passwordHash,
        fullName,
        targetSpecialty,
        targetScore,
        targetExamDate,
    });
}

async function loginUser({ email, password }) {
    const user = await authRepository.findByEmail(email);
    if (!user) {
        const error = new Error('E-posta veya şifre hatalı.');
        error.statusCode = 401;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
        const error = new Error('E-posta veya şifre hatalı.');
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            fullName: user.full_name,
            targetSpecialty: user.target_specialty,
            targetScore: user.target_score,
            targetExamDate: user.target_exam_date,
            createdAt: user.created_at,
        },
    };
}

async function getUserProfile(userId) {
    const user = await authRepository.findById(userId);
    if (!user) {
        const error = new Error('Kullanıcı bulunamadı.');
        error.statusCode = 404;
        throw error;
    }
    return user;
}

async function updateTargetExamDate(userId, targetExamDate) {
    const user = await authRepository.updateTargetExamDate(userId, targetExamDate ?? null);
    if (!user) {
        const error = new Error('Kullanıcı bulunamadı.');
        error.statusCode = 404;
        throw error;
    }
    return {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        targetSpecialty: user.target_specialty,
        targetScore: user.target_score,
        targetExamDate: user.target_exam_date,
        createdAt: user.created_at,
    };
}

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateTargetExamDate,
};
