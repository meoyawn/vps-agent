set -gx LESS '-g -i -M -R -S -w -z-4'

if status is-interactive
    # Commands to run in interactive sessions can go here
    alias amen      'git commit -m amen'
    alias gst       'git status'
    alias ga        'git add'
    alias gcmsg     'git commit -m'
    alias gp        'git push'
    alias gco       'git checkout'
    alias gcm       'git checkout master'

    function ggpull --description 'Pull current branch from origin' --wraps 'git pull'
        git pull origin (git branch --show-current) $argv
    end
end

function fish_prompt
    set -l cwd (prompt_pwd)
    set -l git_branch (fish_git_prompt "%s")
    set -l git_is_dirty 0

    if test -n "$git_branch"
        if test -n "$(command git status --porcelain --ignore-submodules=dirty 2>/dev/null)"
            set git_is_dirty 1
        end
    end

    set_color --bold $fish_color_normal
    printf 'λ '
    set_color $fish_color_cwd

    if test -n "$git_branch"
        printf '%s ' $cwd
        set_color $fish_color_param
        printf '⎇ %s' $git_branch

        if test $git_is_dirty -eq 1
            set_color $fish_color_error
            printf ' [+]'
        end
    else
        printf '%s' $cwd
    end

    set_color $fish_color_normal
    printf '> '
end

# region Command duration
# Command duration prompt helpers
function __prompt_command_duration --description 'Format the last command duration'
    if not set -q CMD_DURATION
        return
    end

    set -l duration_ms $CMD_DURATION

    if test $duration_ms -lt 1000
        printf '%sms' $duration_ms
        return
    end

    set -l total_seconds (math -s0 "$duration_ms / 1000")

    if test $total_seconds -lt 60
        printf '%ss' $total_seconds
        return
    end

    set -l minutes (math -s0 "$total_seconds / 60")
    set -l seconds (math -s0 "$total_seconds % 60")

    if test $minutes -lt 60
        printf '%sm %ss' $minutes $seconds
        return
    end

    set -l hours (math -s0 "$minutes / 60")
    set -l remaining_minutes (math -s0 "$minutes % 60")

    printf '%sh %sm' $hours $remaining_minutes
end

function fish_right_prompt
    if not set -q CMD_DURATION
        return
    end

    if test $CMD_DURATION -le 0
        return
    end

    set_color $fish_color_comment
    __prompt_command_duration
    set_color $fish_color_normal
end
# endregion Command duration
