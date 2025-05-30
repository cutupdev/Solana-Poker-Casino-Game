use anchor_lang::prelude::*;

declare_id!("2rT5faxcrTnWXE125tWzzje9PFHt3k4C3VUjhNfQuzvY");

#[program]
pub mod poksol_leaderboard {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        msg!("Leaderboard initialized");
        Ok(())
    }

    pub fn update_score(ctx: Context<UpdateScore>, score: u64) -> Result<()> {
        let user_score = &mut ctx.accounts.user_score;
        user_score.user = ctx.accounts.user.key();
        user_score.score = score;
        msg!("Score updated for user: {:?}", user_score.user);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
#[instruction(score: u64)]
pub struct UpdateScore<'info> {
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + 32 + 8,
        seeds = [b"user-score", user.key().as_ref()],
        bump
    )]
    pub user_score: Account<'info, UserScore>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct UserScore {
    pub user: Pubkey,
    pub score: u64,
}